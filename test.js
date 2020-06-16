// let ind = [0,1,2,3,4,5,6]
let mel = [0,0,2,0,2,3,3]
let subset = [0,2,3]
let result = [
    [0,2,5],
    [0,2,6],
    [0,4,5],
    [0,4,6],
    [1,2,5],
    [1,2,6],
    [1,4,5],
    [1,4,6],
    [3,4,5],
    [3,4,6]
]


const find_it = function (find=[0,2,3], arr = [0,0,2,0,2,3,3]) {
    let paths = []

    const run_it = function (find,arr,path=[],ind=0) {
        if(find.length==0) return path

        let find_this = find[0]
        for (let i = ind; i < arr.length; i++) {
            if(arr[i]==find_this) {
                let new_ind
                new_ind = (ind==i)?  i+1 : i
                let res = run_it(find.slice(1),arr,[...path,i],new_ind)
                if(res) paths.push(res)
            }
        }
    }
    run_it(find,arr)
    return paths

}
console.log(find_it())