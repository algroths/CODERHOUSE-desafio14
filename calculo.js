const calculo = () => {
    let num = process.argv[2]
    const obj = []
    if (num === "undefined") {

        let num = 1 * 10e5
    }

    for (let i = 0; i < num; i++) {
        let random = Math.round(Math.random() * 1000)

        console.log(random)
        obj.push(random)
    }


    return obj
}


const num = calculo()

process.send(num)