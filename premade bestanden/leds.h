#if !defined(LEDS_DEFINED)
	#define LEDS_DEFINED
	
	void InitLeds(void);
	void ByteToLeds(uint8_t data);
	void ToggleLed(uint8_t ledNumber);
#endif
