
//in this file we define our methods to make the CRUD calls
//all functions from here are generally usable for any entity,
//we don't use it only once time, we can use those functions for many entities in different places along our app
//if we did not had this file with functions, then we had to copy the same code over and over again

//each function defined here, returns an promise(using built in fetch method), and the handling of the response
//is done where the functions are used, not here

//our base url where the API is
export const baseUrl = 'http://192.168.100.187/www/timcomplaint-api/';

//we can use List to get the list of complaints, the categories, and even other lists in the future
export function List(endpoint, options) {
    let url = baseUrl.concat(endpoint,'/read.php');
    if(options){
        url = url.concat('?uid=',options)
    }
    let obj = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    return fetch(url, obj);

}

//we use Get to get only one item, for example only the complaint with id N, or the user with id N, etc.
export function Get(endpoint, id) {
    let url = baseUrl.concat(endpoint,'/read_one.php?id=',id);
    let obj = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };
    return fetch(url, obj);
}

//this function is used to create an user, when clicking save details at login screen
//this not only works with users, it also can work with categories, and other
//this uses JSON data
export function CreateJSON(endpoint, data) {
    let url = baseUrl.concat(endpoint,'/create.php');
    let obj = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data)
    };

    return fetch(url,obj);
}

export function UpdateJSON(endpoint, data) {
    let url = baseUrl.concat(endpoint,'/update.php');
    let obj = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(data)
    };

    return fetch(url,obj);
}


//this function is only dedicated to complaint creation
//since it uses another type of data
//fd means FormData and through form data we can send files, that's why we use it,
//to upload the complaint pictures
export function CreateFD(endpoint, fd) {

    let url = baseUrl.concat(endpoint,'/create.php');
    let obj = {
        method: 'POST',
        body: fd
    };

    return fetch(url, obj);
}
