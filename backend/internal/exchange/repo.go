package exchange

import "gorm.io/gorm"

type Repo struct {
	db *gorm.DB
}

func NewRepo(db *gorm.DB) *Repo {
	return &Repo{db: db}
}

func (r *Repo) Create(rate *ExchangeRate) error {
	return r.db.Create(rate).Error
}

func (r *Repo) List() ([]ExchangeRate, error) {
	var rates []ExchangeRate
	if err := r.db.Find(&rates).Error; err != nil {
		return nil, err
	}
	return rates, nil
}
