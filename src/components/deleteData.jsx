// url è l'url a cui fare la richiesta
// auth è l'autorizzazione
// onDone è una funzione da eseguire con
//  true o false in base al risultato della fetch

const deleteData = (url, auth, onDone) => {
    fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `${auth}`,
        },
    })
        .then((res) => {
            if (res.ok) {
                console.log("Data deleted");
                onDone?.(true);
            } else {
                throw new Error(
                    `error in the first .then (DELETE): ${res.status} - ${res.statusText}`,
                );
            }
        })
        .catch((e) => {
            console.log(
                `Error communicating with the server, please try again. Error: ${e}`,
            );
            onDone?.(false);
        });
};
export default deleteData;
