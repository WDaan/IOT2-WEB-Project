const sanitize = require('../../utils/sanitize')

describe('text sanitation module', () => {
    it('should be null', () => {
        expect.assertions(4)
        expect(sanitize(null)).toBeNull()
        expect(sanitize('%qsd')).toBeNull()
        expect(sanitize('Au%To')).toBeNull()
        expect(sanitize(`    
        
        %%qsdf

    `)).toBeNull()
    })
    it('should return a lowercase word', () => {
        expect.assertions(7)
        expect(sanitize('hallo')).toBe('hallo')
        expect(sanitize('AUTO')).toBe('auto')
        expect(sanitize('AuTo')).toBe('auto')
        expect(sanitize(`
        hond
    
        `)).toBe('hond')
        expect(sanitize(`    
        
            hond
            %%qsdf
    
        `)).toBe('hond')
        expect(sanitize(`
            pa"ard%
            test
            %sqdf
    
        `)).toBe('test')
        expect(sanitize(`
            
            pa"ard%
            tEsT
            
    
        `)).toBe('test')
    })
})
