const names = [
    'Ealasaid', 'Omero', 'Marge', 'Timofei', 'Heath', 'Devlen', 'Aubert', 'Annadiana', 'Elfrida', 'Kellen', 'Maria', 'Allie', 'Aloysia', 'Estele', 'Ebony', 'Myrle', 'Olimpia', 'Legra', 'Ray', 'Geno', 'York', 'Leese', 'Mersey', 'Melony', 'Melanie', 'Hermine', 'Tildy', 'Florie', 'Ilyssa', 'Ariella', 'Jonis', 'Humberto', 'Fax', 'Packston', 'Andrea', 'Dag', 'Ewan', 'Devonne', 'Leonie', 'Homerus', 'Julio', 'Yanaton', 'Hilliary', 'Bette', 'Melony', 'Merill', 'Craggy', 'Clayton', 'Salli', 'Lora'
];

$(() => {
    $('button').click(() => {
        $.each(names, (key, val) => {
            $('ul').append(`<li>${val}</li>`);
        });
    });
});