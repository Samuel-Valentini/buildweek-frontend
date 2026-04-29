// url è l'url a cui fare la richiesta
// auth è l'autorizzazione
// setData è la funzione definita tramite l'hook useState

const getData = (url, auth, setData) => {
    fetch(url, {
        headers: {
            Authorization: `${auth}`,
        },
    })
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(
                    `error in the first .then (GET): ${res.status} - ${res.statusText}`,
                );
            }
        })
        .then((res) => {
            setData(res);
            // console.log(res);
        })
        .catch((e) => {
            console.log(
                `Error communicating with the server, please try again. Error: ${e}`,
            );
        });
};

export default getData;
