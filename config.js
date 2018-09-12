const helper = {
    __DEBUG__:true,
    alertD: function(...args) {
        if (this.__DEBUG__) {
            args.map((arg) => {
                console.log(arg)
            })
        }
    }
}

module.exports = {helper}