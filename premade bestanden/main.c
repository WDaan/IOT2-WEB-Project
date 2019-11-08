// Basiscode voor het starten van eender welk project op Nucleo-F091RC. 
// Versie: 20190205

#include "stm32f091xc.h"
#include "stdio.h"
#include "stdbool.h"
#include "leds.h"
#include "buttons.h"
#include "ad.h"
#include "math.h"

void SystemClock_Config(void);
void InitIo(void);
void WaitForMs(uint32_t timespan);

uint8_t count = 0;
char text[101];
volatile uint32_t ticks = 0;

void AdcToLeds(uint16_t value){
	value = floor(value/455); /*455 want 4096/9 = 455*/
	//printf("value: %d\n", value);
	switch(value){
		case 1:
			ByteToLeds(1);
			break;
		case 2:
			ByteToLeds(3);
			break;
		case 3:
			ByteToLeds(7);
			break;
		case 4:
			ByteToLeds(15);
			break;
		case 5:
			ByteToLeds(31);
			break;
		case 6:
			ByteToLeds(63);
			break;
		case 7:
			ByteToLeds(127);
			break;
		case 8:
			ByteToLeds(255);
			break;
		default:
			ByteToLeds(0);
			break;
	}
}

void setMAXLed(uint16_t value, uint16_t max){
	uint16_t temp = value;
	value = floor(value/455); /*455 want 4096/9 = 455*/
	max = floor(max/455) -1;
	switch(value){
		case 1:
			ByteToLeds(1 | (1 << max));
			break;
		case 2:
			ByteToLeds(3 | (1 << max));
			break;
		case 3:
			ByteToLeds(7 | (1 << max));
			break;
		case 4:
			ByteToLeds(15 | (1 << max));
			break;
		case 5:
			ByteToLeds(31 | (1 << max));
			break;
		case 6:
			ByteToLeds(63 | (1 << max));
			break;
		case 7:
			ByteToLeds(127 | (1 << max));
			break;
		case 8:
			ByteToLeds(255 | (1 << max));
			break;
		default:
			ByteToLeds(0);
			break;
	}
	
}

void InitTimer7();

int main(void)
{
	SystemClock_Config();
	InitIo();
	InitLeds();
	initAD();
	InitTimer7();
	
	while (1)
	{
			if(SW1Active()){
				
			}
	
	
		}
}

void InitTimer7(){
	RCC-> APB1ENR |= RCC_APB1ENR_TIM7EN;
	
	TIM7->PSC = 48000;
	
	TIM7->ARR = 500; //elke 500ms een interupt
	
	TIM7->DIER |= TIM_DIER_UIE;
	TIM7->CR1 |= TIM_CR1_CEN;
	
	NVIC_SetPriority(TIM7_IRQn, 0);
	NVIC_EnableIRQ(TIM7_IRQn);
}

void TIM7_IRQHandler(){
	if((TIM7->SR & TIM_SR_UIF) == TIM_SR_UIF){
		
		TIM7->SR &= ~TIM_SR_UIF; //timer resetten
		
		//led1 togglen
		GPIOC->ODR ^= GPIO_ODR_0;
		
	}
}


void InitIo(void)
{
	RCC->APB2ENR |= RCC_APB2ENR_SYSCFGEN;
	
	// PA1 koppelen aan EXTI 1.
	SYSCFG->EXTICR[1] |= SYSCFG_EXTICR1_EXTI1_PA;
	
	// Falling edge detecteren op 'PA1'.
	EXTI->FTSR |= EXTI_FTSR_TR1;
	
	// Interrupt toelaten.
	EXTI->IMR |= EXTI_IMR_MR1;
	
	// Software prioriteit kiezen.
	NVIC_SetPriority(EXTI0_1_IRQn, 0);
	
	// Koppeling maken met een interrupt handler.
	NVIC_EnableIRQ(EXTI0_1_IRQn);
	
	
	//SW2
	RCC->APB2ENR |= RCC_APB2ENR_SYSCFGEN;
	
	// PA4 koppelen aan EXTI 4.
	SYSCFG->EXTICR[1] |= SYSCFG_EXTICR2_EXTI4_PA;
	
	// Falling edge detecteren op 'PA4'.
	EXTI->FTSR |= EXTI_FTSR_TR4;
	
	// Interrupt toelaten.
	EXTI->IMR |= EXTI_IMR_MR4;
	
	// Software prioriteit kiezen.
	NVIC_SetPriority(EXTI4_15_IRQn, 0);
	
	// Koppeling maken met een interrupt handler.
	NVIC_EnableIRQ(EXTI4_15_IRQn);
}

void EXTI0_1_IRQHandler(void)
{
	// Controleren of effectief op PA1 gedrukt werd.
	if((EXTI->PR & EXTI_PR_PR1) == EXTI_PR_PR1)
	{
		// LED's inschakelen.
		ByteToLeds(255);
		
		// Interruptvlag resetten.
		EXTI->PR |= EXTI_PR_PR1;
	}
}

void EXTI4_15_IRQHandler(void)
{
	// Controleren of effectief op PA4 gedrukt werd.
	if((EXTI->PR & EXTI_PR_PR4) == EXTI_PR_PR4)
	{
		// LED's inschakelen.
		ByteToLeds(0);
		
		// Interruptvlag resetten.
		EXTI->PR |= EXTI_PR_PR4;
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
