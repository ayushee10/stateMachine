const Document = require('./model');

module.exports.updateEntity = async(entity) =>{
    try{
        const doc = await Document.findOneAndUpdate({docName: entity.docName},
            { $set: entity},
            {
                new: true,
                upsert: true,
            });
            return doc;
    }
    catch(err) {
        throw new Error("db operation updateEntity failed ", err)
    }
}

module.exports.findOne = async(docName) =>{
    try{
        const doc = await Document.findOne({docName: docName}, '-_id -__v');
        return doc
    }
    catch(err) {
        throw new Error("db operation findOne failed ", err)
    }
}

module.exports.cleanDb = async() =>{
    try{
        await Document.deleteMany({});
    }
    catch(err) {
        throw new Error("db operation cleanDb failed ", err)
    }
}

