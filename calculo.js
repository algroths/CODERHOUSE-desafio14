const calculo = () => {
    let num = process.argv[2]
    const obj = []
    if (num === "undefined") {
        num = 1 * 10e5
    }

    for (let i = 0; i < num; i++) {
        let random = Math.round(Math.random() * 1000)

        obj.push(random)
    }
    return obj
}
const num = calculo()

process.send(num)