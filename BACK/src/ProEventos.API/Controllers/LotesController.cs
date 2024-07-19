using Microsoft.AspNetCore.Mvc;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;

namespace ProEventos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LotesController : ControllerBase
{
    private readonly ILoteService _loteService;
    
    public LotesController(ILoteService eventoService)
    {
        _loteService = eventoService;
    }
    
    [HttpGet("{eventoId}")]
    public async Task<IActionResult> Get(int eventoId)
    {
        try
        {
            var lotes = await _loteService.GetLotesByEventoIdAsync(eventoId);
            if(lotes == null) return NoContent();

            return Ok(lotes);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar os lotes do evento {eventoId}. Erro: {ex.Message}");
        }
    }

    [HttpPut("{eventoId}")]
    public async Task<IActionResult> SaveLotes(int eventoId, LoteDto[] models){
        try
        {
            var lotes = await _loteService.SaveLotes(eventoId, models);
            if(lotes == null) return NoContent();

            return Ok(lotes);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar salvar os lotes. Erro: {ex.Message}");
        }
    }

    [HttpDelete("{eventoId}/{loteId}")]
    public async Task<IActionResult> Delete(int eventoId, int loteId){
        try
        {
            var lote = await _loteService.GetLoteByIdsAsync(eventoId, loteId);
            if (lote == null) return NoContent();

            if (await _loteService.DeleteLote(lote.EventoId, lote.Id))
                return Ok(new {message = "Deletado"});
            else
                throw new Exception("Ocorreu um problema não especificado ao tentar deletar o lote: #" + lote.Id);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar deletar os lotes. Erro: {ex.Message}");
        }
    }
}
