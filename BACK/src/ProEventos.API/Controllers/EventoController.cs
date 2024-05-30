using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventoController : ControllerBase
{
    public EventoController()
    {
    }

    public IEnumerable<Evento> _eventos = new Evento[]
    {
        new Evento{
            EventoId = 1,
            Tema = "Angular 11 net 8",
            Local = "Camaragibe - PE",
            Lote = "1º Lote",
            QtdPessoas = 250,
            DataEvento = DateTime.Now.AddDays(2).ToString(),
            ImagemUrl = "foto.png"
        },
        new Evento{
                EventoId = 2,
            Tema = "Angular 11 net 8 e suas novidades",
            Local = "São Paulo - SP",
            Lote = "1º Lote",
            QtdPessoas = 350,
            DataEvento = DateTime.Now.AddDays(2).ToString(),
            ImagemUrl = "foto1.png"
        }
    };

    [HttpGet]
    public IEnumerable<Evento> Get()
    {
        return _eventos;
    }

    [HttpGet("{id}")]
    public IEnumerable<Evento> GetById(int id)
    {
        return _eventos.Where(x => x.EventoId == id);
    }
}
