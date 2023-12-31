// Referencias HTML
const lblNuevoEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has('escritorio')) {
  window.location = 'index.html';
  throw new Error('El escritorio es necesario');
}

const escritorio = searchParams.get('escritorio');
lblNuevoEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
  // console.log('Conectado');
  btnAtender.disabled = false;
});

socket.on('disconnect', () => {
  // console.log('Desconectado del servidor');
  btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (pendientes) => {
  console.log(pendientes);
  if (pendientes === 0) {
    lblPendientes.style.display = 'none';
    divAlerta.style.display = '';
  } else {
    divAlerta.style.display = 'none';
    lblPendientes.style.display = '';
  }
  lblPendientes.innerText = pendientes;
});

btnAtender.addEventListener('click', () => {
  socket.emit('atender-ticket', { escritorio }, ({ ok, ticket, msg }) => {
    if (!ok) {
      lblTicket.innerText = 'Nadie.';
      return (divAlerta.style.display = '');
    }
    lblTicket.innerText = 'Ticket ' + ticket.numero;
  });
});
