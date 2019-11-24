const SerialPort = require('serialport')

class Serial {
    constructor() {
        this.port = new SerialPort('/dev/ttyACM0', {
            baudRate: 115200,
            autoOpen: false,
        })

        console.log('Serial helper created!')
    }

    writeLine(line) {
        this.port.open((error) => {
            if (error) console.log('Error communicating with Nucleo..')
            else {
                this.port.write(line)
                this.port.close()
            }
        })
    }
}

exports.default = new Serial()
