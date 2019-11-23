#include "stm32f091xc.h"
#include "stdio.h"
#include "stdbool.h"
#include "leds.h"
#include "buttons.h"
#include "usart2.h"
#include <string.h>
#include "spi1.h"


void SystemClock_Config(void);
void InitIo(void);
void WaitForMs(uint32_t timespan);

volatile uint32_t ticks = 0;

//enum usartState {idle, busyReceiving, newStringArrived, receptionTimeOut, overflowOccured};
//volatile enum usartState usart2State = idle;

int main(void)
{
	SystemClock_Config();
	InitIo();
	InitLeds();
	InitUsart2(115200);
	InitSpi1();
	
	uint8_t data[] =  //BLUE GREEN RED
		{ 0x00, 0x00, 0x00, 0x00, //start frame
			0x00, 0x00, 0x00, 0x00, //start frame
			0x97, 0xFF, 0x00, 0x00, //led frame 1: blue
			0x97, 0x00, 0xFF, 0x00, //led frame 2: green
			0x97, 0x00, 0x00, 0xFF, //led frame 3: red
			0x97, 0x00, 0xFF, 0xFF, //led frame 4: yellow
			0x97, 0xFF, 0xFF, 0xFF, //led frame 5: white
			0x00, 0x00, 0x00, 0x00, //end frame
			0x00, 0x00, 0x00, 0x00, //end frame
		};
	
	while (1)
	{	
		char text[10] = "hallo\r\n";
		StringToUsart2(text);
		WaitForMs(1000);
	  for(uint8_t i = 0; i < sizeof(data)/sizeof(uint8_t); i++){
			ByteToSpi1(data[i]);
			char str[12];
			sprintf(str, "%d : Byte: %d\n", i, data[i]);
			StringToUsart2(str);
		}
		StringToUsart2("\r\n");
		WaitForMs(1000);
	}
}

void InitIo(void)
{

}

// Interrupt handler van USART2
void USART2_IRQHandler(void)
{
	// Byte ontvangen?
	if((USART2->ISR & USART_ISR_RXNE) == USART_ISR_RXNE)
	{
		// Byte ontvangen, lees hem om alle vlaggen te wissen.
		uint8_t temp = USART2->RDR;
		char text[50];
		sprintf(text, "%d", temp);
		strcat(text, "\r\n");
		StringToUsart2(text);
		WaitForMs(1000);
	}
}



// Handler die iedere 1ms afloopt. Ingesteld met SystemCoreClockUpdate() en SysTick_Config().
void SysTick_Handler(void)
{
	ticks++;
}

void WaitForMs(uint32_t timespan)
{
	uint32_t startTime = ticks;
	
	while(ticks < startTime + timespan);
}

void SystemClock_Config(void)
{
	RCC->CR |= RCC_CR_HSITRIM_4;														// HSITRIM op 16 zetten, dit is standaard (ook na reset).
	RCC->CR  |= RCC_CR_HSION;																// Internal high speed oscillator enable (8MHz)
	while((RCC->CR & RCC_CR_HSIRDY) == 0);									// Wacht tot HSI zeker ingeschakeld is
	
	RCC->CFGR &= ~RCC_CFGR_SW;															// System clock op HSI zetten (SWS is status geupdatet door hardware)	
	while((RCC->CFGR & RCC_CFGR_SWS) != RCC_CFGR_SWS_HSI);	// Wachten to effectief HSI in actie is getreden
	
	RCC->CR &= ~RCC_CR_PLLON;																// Eerst PLL uitschakelen
	while((RCC->CR & RCC_CR_PLLRDY) != 0);									// Wacht tot PLL zeker uitgeschakeld is
	
	RCC->CFGR |= RCC_CFGR_PLLSRC_HSI_PREDIV;								// 01: HSI/PREDIV selected as PLL input clock
	RCC->CFGR2 |= RCC_CFGR2_PREDIV_DIV2;										// prediv = /2		=> 4MHz
	RCC->CFGR |= RCC_CFGR_PLLMUL12;													// PLL multiplied by 12 => 48MHz
	
	FLASH->ACR |= FLASH_ACR_LATENCY;												//  meer dan 24 MHz, dus latency op 1 (p 67)
	
	RCC->CR |= RCC_CR_PLLON;																// PLL inschakelen
	while((RCC->CR & RCC_CR_PLLRDY) == 0);									// Wacht tot PLL zeker ingeschakeld is

	RCC->CFGR |= RCC_CFGR_SW_PLL; 													// PLLCLK selecteren als SYSCLK (48MHz)
	while((RCC->CFGR & RCC_CFGR_SWS) != RCC_CFGR_SWS_PLL);	// Wait until the PLL is switched on
		
	RCC->CFGR |= RCC_CFGR_HPRE_DIV1;												// SYSCLK niet meer delen, dus HCLK = 48MHz
	RCC->CFGR |= RCC_CFGR_PPRE_DIV1;												// HCLK niet meer delen, dus PCLK = 48MHz	
	
	SystemCoreClockUpdate();																// Nieuwe waarde van de core frequentie opslaan in SystemCoreClock variabele
	SysTick_Config(48000);																	// Interrupt genereren. Zie core_cm0.h, om na ieder 1ms een interrupt 
																													// te hebben op SysTick_Handler()
}