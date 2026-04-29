// url è l'url a cui fare la richiesta
// dataToSend sono i dati da inviare
// auth è l'autorizzazione
// onDone è una funzione da eseguire con
//  true o false in base al risultato della fetch

const postData = (url, dataToSend, auth, onDone) => {
    fetch(url, {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
            "Content-Type": "application/json",
            Authorization: `${auth}`,
        },
    })
        .then((res) => {
            if (res.ok) {
                console.log("Comment added.");
                onDone?.(true);
            } else {
                throw new Error(
                    `error in the first .then (POST): ${res.status} - ${res.statusText}`,
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
export default postData;
