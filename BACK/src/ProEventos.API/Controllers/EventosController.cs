using Microsoft.AspNetCore.Mvc;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;

namespace ProEventos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventosController : ControllerBase
{
    private readonly IEventoService _eventoService;
    
    public EventosController(IEventoService eventoService)
    {
        _eventoService = eventoService;
    }
    
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            var eventos = await _eventoService.GetAllEventosAsync(true);
            if(eventos == null) return NoContent();

            var eventosRetorno = new List<EventoDto>();

            foreach (var evento in eventos)
            {
                eventosRetorno.Add(new EventoDto(){
                    Id = evento.Id,
                    Local = evento.Local,
                    DataEvento = evento.DataEvento,
                    Tema = evento.Tema,
                    QtdPessoas = evento.QtdPessoas,
                    ImagemUrl = evento.ImagemUrl,
                    Telefone = evento.Telefone,
                    Email = evento.Email
                });
            }

            return Ok(eventosRetorno);
        }
        catch (Exception ex)
        {
            
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
       try
        {
            var evento = await _eventoService.GetEventosByIdAsync(id, true);
            if(evento == null) return NoContent();

            return Ok(evento);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
        }
    }

    [HttpGet("{tema}/tema")]
    public async Task<IActionResult> GetByTema(string tema)
    {
       try
        {
            var evento = await _eventoService.GetAllEventosByTemaAsync(tema, true);
            if(evento == null) return NoContent();

            return Ok(evento);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar eventos por tema. Erro: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post(EventoDto model){
        try
        {
            var evento = await _eventoService.AddEvento(model);
            if(evento == null) return NoContent();

            return Ok(evento);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar adicionar/criar evento. Erro: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, EventoDto model){
        try
        {
            var evento = await _eventoService.UpdateEvento(id, model);
            if(evento == null) return NoContent();

            return Ok(evento);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar atualizar evento. Erro: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id){
        try
        {
            var evento = await _eventoService.GetEventosByIdAsync(id, true);
            if (evento == null) return NoContent();

            if (await _eventoService.DeleteEvento(id))
                return Ok(new {message = "Deletado"});
            else
                throw new Exception("Ocorreu um problema não especificado ao tentar deletar o Evento: #" + id);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar deletar o evento. Erro: {ex.Message}");
        }
    }
}
