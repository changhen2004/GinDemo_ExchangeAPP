package exchange

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Service struct {
	repo *Repo
}

func NewService(repo *Repo) *Service {
	return &Service{repo: repo}
}

func (s *Service) Create(req CreateExchangeRateRequest) (MessageResponse, error) {
	rate := &ExchangeRate{
		FromCurrency: req.FromCurrency,
		ToCurrency:   req.ToCurrency,
		Rate:         req.Rate,
		Date:         time.Now(),
	}

	if err := s.repo.Create(rate); err != nil {
		return MessageResponse{}, err
	}

	return MessageResponse{Message: "Exchange rate created successfully"}, nil
}

func (s *Service) List() ([]ExchangeRateResponse, error) {
	rates, err := s.repo.List()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrExchangeRateNotFound
		}
		return nil, err
	}
	return toExchangeRateResponses(rates), nil
}
