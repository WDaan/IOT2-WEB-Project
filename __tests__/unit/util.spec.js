const sanitize = require('../../utils/sanitize')

it('Test text sanitation', () => {
    expect(sanitize(null)).toBe(null)
    expect(sanitize('hallo')).toBe('hallo')
    expect(sanitize('%qsd')).toBe(null)
    expect(sanitize('AUTO')).toBe('auto')
    expect(sanitize('AuTo')).toBe('auto')
    expect(sanitize('Au%To')).toBe(null)
    expect(sanitize(`    
    
        %%qsdf

    `)).toBe(null)

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
