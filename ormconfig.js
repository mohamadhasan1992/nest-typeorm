module.exports = {
    type: 'sqlite',
    database: 'db.sqlite',
    entities:
        process.env.NODE_ENV == 'development'? 
        ['**/*.entity.js'] :
        ['**/*.entity.ts'],
    synchronize: false
}