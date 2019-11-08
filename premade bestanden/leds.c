#include "stm32f091xc.h"

void InitLeds(void)
{
	// Clock voor GPIOA inschakelen.
	RCC->AHBENR = RCC->AHBENR | RCC_AHBENR_GPIOAEN;
	
	// Clock voor GPIOB inschakelen.
	RCC->AHBENR = RCC->AHBENR | RCC_AHBENR_GPIOBEN;
	
	// Clock voor GPIOC inschakelen.
	RCC->AHBENR = RCC->AHBENR | RCC_AHBENR_GPIOCEN;	
	
	// LED1 tot LED8 op output zetten
	GPIOC->MODER = (GPIOC->MODER & ~GPIO_MODER_MODER0) | GPIO_MODER_MODER0_0;
	GPIOB->MODER = (GPIOB->MODER & ~GPIO_MODER_MODER3) | GPIO_MODER_MODER3_0;
	GPIOB->MODER = (GPIOB->MODER & ~GPIO_MODER_MODER5) | GPIO_MODER_MODER5_0;
	GPIOB->MODER = (GPIOB->MODER & ~GPIO_MODER_MODER4) | GPIO_MODER_MODER4_0;
	GPIOB->MODER = (GPIOB->MODER & ~GPIO_MODER_MODER10) | GPIO_MODER_MODER10_0;
	GPIOA->MODER = (GPIOA->MODER & ~GPIO_MODER_MODER8) | GPIO_MODER_MODER8_0;
	GPIOC->MODER = (GPIOC->MODER & ~GPIO_MODER_MODER7) | GPIO_MODER_MODER7_0;
	GPIOB->MODER = (GPIOB->MODER & ~GPIO_MODER_MODER6) | GPIO_MODER_MODER6_0;
}

// Functie om de data van één byte op de 8 LED's te plaatsen
void ByteToLeds(unsigned char data)
{
	if(data & 0x01)
		GPIOC->ODR = GPIOC->ODR | GPIO_ODR_0;		// inschakelen
	else
		GPIOC->ODR = GPIOC->ODR & ~GPIO_ODR_0;	// uitschakelen

	if(data & 0x02)
		GPIOB->ODR = GPIOB->ODR | GPIO_ODR_3;		// inschakelen
	else
		GPIOB->ODR = GPIOB->ODR & ~GPIO_ODR_3;	// uitschakelen

	if(data & 0x04)
		GPIOB->ODR = GPIOB->ODR | GPIO_ODR_5;		// inschakelen
	else
		GPIOB->ODR = GPIOB->ODR & ~GPIO_ODR_5;	// uitschakelen

	if(data & 0x08)
		GPIOB->ODR = GPIOB->ODR | GPIO_ODR_4;		// inschakelen
	else
		GPIOB->ODR = GPIOB->ODR & ~GPIO_ODR_4;	// uitschakelen

	if(data & 0x10)
		GPIOB->ODR = GPIOB->ODR | GPIO_ODR_10;	// inschakelen
	else
		GPIOB->ODR = GPIOB->ODR & ~GPIO_ODR_10;	// uitschakelen

	if(data & 0x20)
		GPIOA->ODR = GPIOA->ODR | GPIO_ODR_8;		// inschakelen
	else
		GPIOA->ODR = GPIOA->ODR & ~GPIO_ODR_8;	// uitschakelen

	if(data & 0x40)
		GPIOC->ODR = GPIOC->ODR | GPIO_ODR_7;		// inschakelen
	else
		GPIOC->ODR = GPIOC->ODR & ~GPIO_ODR_7;	// uitschakelen

	if(data & 0x80)
		GPIOB->ODR = GPIOB->ODR | GPIO_ODR_6;		// inschakelen
	else
		GPIOB->ODR = GPIOB->ODR & ~GPIO_ODR_6;	// uitschakelen
}

void ToggleLed(uint8_t ledNumber)
{
	switch(ledNumber)
	{
		case 1:
			GPIOC->ODR = GPIOC->ODR ^ GPIO_ODR_0;
			break;
		
		case 2:
			GPIOB->ODR = GPIOB->ODR ^ GPIO_ODR_3;
			break;
		
		case 3:
			GPIOB->ODR = GPIOB->ODR ^ GPIO_ODR_5;
			break;
		
		case 4:
			GPIOB->ODR = GPIOB->ODR ^ GPIO_ODR_4;
			break;
		
		case 5:
			GPIOB->ODR = GPIOB->ODR ^ GPIO_ODR_10;
			break;
		
		case 6:
			GPIOA->ODR = GPIOA->ODR ^ GPIO_ODR_8;
			break;
		
		case 7:
			GPIOC->ODR = GPIOC->ODR ^ GPIO_ODR_7;
			break;
		
		case 8:
			GPIOB->ODR = GPIOB->ODR ^ GPIO_ODR_6;
			break;
		
		default:
			break;
	}
}
