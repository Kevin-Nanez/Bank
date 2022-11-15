const path = require('path');
const fs   = require('fs');

class Ticket {
    constructor( numero, escritorio, hora ) {
        this.numero = numero;
        this.escritorio = escritorio;
        this.hora = hora;
    }
}


class TicketControl {


    constructor() {
        this.ultimo   = 0;
        this.hoy      = new Date().getDate(); // 11
        this.tickets  = [];
        this.ultimos4 = [];

        this.init();
    }


    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
        }
    }

    init() {
        const { hoy, tickets, ultimo, ultimos4 } = require('../db/data.json');
        if ( hoy === this.hoy ) {
            this.tickets  = tickets;
            this.ultimo   = ultimo;
            this.ultimos4 = ultimos4;
        } else {
            // Es otro dia
            this.guardarDB();
        }
    }

    guardarDB() {

        const dbPath = path.join( __dirname, '../db/data.json' );
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ) );

    }

    siguiente() {
        //MODIFICADO
        let hour = new Date().getHours()
        let minutos = new Date().getMinutes()
        let segundos = new Date().getSeconds()
        const hora = `${hour}:${minutos}:${segundos}`
        console.log(hora)
        this.ultimo += 1;
        const ticket = new Ticket( this.ultimo, null, hora);
        this.tickets.push( ticket );
        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket( escritorio ) {

        // No tenemos tickets
        if ( this.tickets.length === 0 ) {
            return null;
        }

        const ticket = this.tickets.shift(); // this.tickets[0];
        ticket.escritorio = escritorio;

        this.ultimos4.unshift( ticket );

        if ( this.ultimos4.length > 4 ) {
            this.ultimos4.splice(-1,1);
        }

        this.guardarDB();

        return ticket;
    }



}



module.exports = TicketControl;