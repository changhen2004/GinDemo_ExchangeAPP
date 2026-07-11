package worker

import (
	"context"
	"encoding/json"
	"errors"
	"log"

	"resource_community_go/internal/asyncjob"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Runner struct {
	channel   *amqp.Channel
	idemStore IdempotencyStore
	queue     string
	processor *Processor
}

func NewRunner(conn *amqp.Connection, exchange, queue string, processor *Processor, idemStore IdempotencyStore) (*Runner, error) {
	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	if err := ch.ExchangeDeclare(exchange, "direct", true, false, false, false, nil); err != nil {
		_ = ch.Close()
		return nil, err
	}
	if _, err := ch.QueueDeclare(queue, true, false, false, false, nil); err != nil {
		_ = ch.Close()
		return nil, err
	}
	if err := ch.QueueBind(queue, queue, exchange, false, nil); err != nil {
		_ = ch.Close()
		return nil, err
	}

	if idemStore == nil {
		idemStore = NoopIdempotencyStore{}
	}

	return &Runner{
		channel:   ch,
		idemStore: idemStore,
		queue:     queue,
		processor: processor,
	}, nil
}

func (w *Runner) Run(ctx context.Context) error {
	msgs, err := w.channel.Consume(w.queue, "", false, false, false, false, nil)
	if err != nil {
		return err
	}

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case msg, ok := <-msgs:
			if !ok {
				return errors.New("worker delivery channel closed")
			}

			var job asyncjob.Job
			if err := json.Unmarshal(msg.Body, &job); err != nil {
				log.Printf("invalid async job payload: %v", err)
				_ = msg.Nack(false, false)
				continue
			}

			ok, err := w.idemStore.Begin(ctx, job.ID)
			if err != nil {
				log.Printf("idempotency begin failed: jobID=%s err=%v", job.ID, err)
				_ = msg.Nack(false, true)
				continue
			}
			if !ok {
				_ = msg.Ack(false)
				continue
			}

			if err := w.processor.Handle(ctx, job); err != nil {
				log.Printf("process async job failed: type=%s err=%v", job.Type, err)
				_ = msg.Nack(false, true)
				continue
			}

			if err := w.idemStore.Complete(ctx, job.ID); err != nil {
				log.Printf("idempotency complete failed: jobID=%s err=%v", job.ID, err)
				_ = msg.Nack(false, true)
				continue
			}

			_ = msg.Ack(false)
		}
	}
}

func (w *Runner) Close() error {
	if w == nil || w.channel == nil {
		return nil
	}
	return w.channel.Close()
}
