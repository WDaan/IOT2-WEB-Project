#include "stm32f091xc.h"
#include "spi1.h"

void InitSpi1(void)
{
	//poort A klok
	RCC->AHBENR = RCC->AHBENR | RCC_AHBENR_GPIOAEN;
	
	// rcc register instellen
	RCC->APB2ENR |= RCC_APB2ENR_SPI1EN;
	
	//spi1 alternate function op pinnen
	GPIOA->MODER = (GPIOA->MODER & ~(GPIO_MODER_MODER5)) | (GPIO_MODER_MODER5_1);
	GPIOA->MODER = (GPIOA->MODER & ~(GPIO_MODER_MODER7)) | (GPIO_MODER_MODER7_1);

	
	GPIOA->AFR[0] &= 0x01011111;
	
	//SPI mode instellen
	SPI1->CR1 = SPI1->CR1 | SPI_CR1_BR_2 | SPI_CR1_BR_1  | SPI_CR1_BR_0;
	SPI1->CR1 = SPI1->CR1 & ~SPI_CR1_CPOL;
	SPI1->CR1 = SPI1->CR1 & ~SPI_CR1_CPHA;
	SPI1->CR1 = SPI1->CR1 & ~SPI_CR1_BIDIMODE;
	SPI1->CR1 = SPI1->CR1 & ~SPI_CR1_LSBFIRST;
	SPI1->CR1 |= SPI_CR1_SSM;
	SPI1->CR1 |= SPI_CR1_SSI;
	SPI1->CR1 |= SPI_CR1_MSTR;
	SPI1->CR2 = (SPI1->CR2 & ~(SPI_CR2_DS)) | SPI_CR2_DS_0 | SPI_CR2_DS_1 | SPI_CR2_DS_2;
	SPI1->CR2 = SPI1->CR2 & ~SPI_CR2_FRF;
	SPI1->CR2 |= SPI_CR2_FRXTH;
	SPI1->CR2 |= SPI_CR1_SPE;
}

void ByteToSpi1(uint8_t data){
	
	*(uint8_t *)&(SPI1->DR) = data;
	while((SPI1->SR & SPI_SR_BSY) == SPI_SR_BSY);
}

