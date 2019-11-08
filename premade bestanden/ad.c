#include "stm32f091xc.h"

void initAD(void){
	// AD-module init
	RCC->APB2ENR |= RCC_APB2ENR_ADC1EN;
	// right alignment (optioneel)
	ADC1->CFGR1 &= ~ADC_CFGR1_ALIGN;
	// AD aanzetten
	ADC1->CR |= ADC_CR_ADEN;
	while((ADC1->ISR & ADC_ISR_ADRDY) == 0);
	
	//AD kanaal kizen (poort A0)
	ADC1->CHSELR = ADC_CHSELR_CHSEL0;
}

uint16_t GetAdValue(void){
	ADC1->CR |= ADC_CR_ADSTART; //start adc
	while ((ADC1->ISR & ADC_ISR_EOSEQ) == 0); // wait for end reading
	
	return (uint16_t) ADC1->DR;
}
