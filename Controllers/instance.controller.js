const WhatsAppInstance = require('../class/Whatsapp')
const { client_code,webhook, webhookUrl } = require('../config/config')
async function init(req, res) {
    console.log('object')
    if (client_code !== 000) {
        const instance = new WhatsAppInstance(client_code, webhook, webhookUrl)
        const data = await instance.init()
        WhatsAppInstances[data.key] = instance
        const d ={
            error: false,
            message: 'Initializing successfully',
            key: data.key,
            webhook: {
                enabled: webhook,
                webhookUrl: webhookUrl,
            },
            qrcode: {
                url: '/api/instance/qr?key=' + data.key,
                qr:WhatsAppInstances[data.key].instance.qr
            },
        }
        console.log(d)
        res.json(d) 
    } else {
        return 'Un-Authorised'
    }

}

 async function qr(req, res) {
    try {
        const qrcode = await WhatsAppInstances[req.query.key]?.instance.qr
        res.render('qrcode', {
            qrcode: qrcode,
        })
    } catch {
        res.json({
            qrcode: '',
        })
    }
}

 async function qrbase64(req, res) {
    try {
        const qrcode = await WhatsAppInstances[req.query.key]?.instance.qr
        res.json({
            error: false,
            message: 'QR Base64 fetched successfully',
            qrcode: qrcode,
        })
    } catch {
        res.json({
            qrcode: '',
        })
    }
}

 async function info(req, res) {
    const instance = WhatsAppInstances[req.query.key]
    let data
    try {
        data = await instance.getInstanceDetail(req.query.key)
    } catch (error) {
        data = {}
    }
    return res.json({
        error: false,
        message: 'Instance fetched successfully',
        instance_data: data,
    })
}

//  async function restore(req, res, next) {
//     try {
//         const session = new Session()
//         let restoredSessions = await session.restoreSessions()
//         return res.json({
//             error: false,
//             message: 'All instances restored',
//             data: restoredSessions,
//         })
//     } catch (error) {
//         next(error)
//     }
// }

 async function logout(req, res) {
    let errormsg
    try {
        await WhatsAppInstances[req.query.key].instance?.sock?.logout()
    } catch (error) {
        errormsg = error
    }
    return res.json({
        error: false,
        message: 'logout successfull',
        errormsg: errormsg ? errormsg : null,
    })
}

 async function _delete (req, res) {
    let errormsg
    try {
        await WhatsAppInstances[key].deleteInstance(key)
        delete WhatsAppInstances[req.query.key]
    } catch (error) {
        errormsg = error
    }
    return res.json({
        error: false,
        message: 'Instance deleted successfully',
        data: errormsg ? errormsg : null,
    })
}

 async function getqr() {
    try {
        const qrcode = await WhatsAppInstances[data.key]?.instance.qr
        return qrcode
    } catch {
        return false
    }
}

 async function send(req, res) {
    const { id, text } = req;
    try {
        const data = await WhatsAppInstances[data.key]?.sendTextMessage(id, text)
        console.log(data)
        return data
    } catch {
        return false
    }
}

 async function sendButton(req, res) {
    const { id } = req;
    const buttons = [
        {buttonId: 'id1', buttonText: {displayText: 'Button 1'}, type: 1},
        {buttonId: 'id2', buttonText: {displayText: 'Button 2'}, type: 1},
        {buttonId: 'id3', buttonText: {displayText: 'Button 3'}, type: 1}
      ]
      
      const buttonMessage = {
          text: "Please select an option:",
          footer: 'Powered by Baileys',
          buttons: buttons,
          headerType: 1
    }
    
    console.log(id,buttonMessage)
    try {
        const data = await WhatsAppInstances[data.key]?.sendButtonMessage(id,buttonMessage)
        // console.log(data)
        return data
    } catch (error) {
        return error
    }
}



module.exports = { init, qr, qrbase64, info,logout,_delete, getqr, send,sendButton }
