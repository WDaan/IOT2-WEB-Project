#include "stm32f091xc.h"
#include "stdbool.h"

// To Do: InitButtons voorzien.

bool SW1Active(void)
{
	// SW1 actief?
	if((GPIOA->IDR & GPIO_IDR_1) != GPIO_IDR_1)
			return true;
	else
			return false;
}		
	
bool SW2Active(void)
{
	// SW2 actief?
	if((GPIOA->IDR & GPIO_IDR_4) != GPIO_IDR_4)
			return true;
	else
			return false;
}

bool SW3Active(void)
{
	// SW3 actief?
	if((GPIOB->IDR & GPIO_IDR_0) != GPIO_IDR_0)
			return true;
	else
			return false;
}

bool SW4Active(void)
{
	// SW4 actief?
	if((GPIOC->IDR & GPIO_IDR_1) != GPIO_IDR_1)
			return true;
	else
			return false;
}
