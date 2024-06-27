using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{  
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IEventoPersist _eventoPersist;
        private readonly IMapper _mapper;

        public EventoService(IGeralPersist geralPersist, IEventoPersist eventoPersist, IMapper mapper)
        {
            _geralPersist = geralPersist;
            _eventoPersist = eventoPersist;
            _mapper = mapper;
        }
        public async Task<EventoDto> AddEvento(EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);

                _geralPersist.Add<Evento>(evento);

                if (await _geralPersist.SaveChangesAsync())
                {
                    var EventoRetorno = await _eventoPersist.GetEventosByIdAsync(evento.Id, false);

                    return _mapper.Map<EventoDto>(EventoRetorno);
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);                
            }
        }

        public async Task<EventoDto> UpdateEvento(int eventoId, EventoDto model)
        {
            try
            {
                var evento = await _eventoPersist.GetEventosByIdAsync(eventoId, false);
                if (evento == null) return null;

                model.Id = evento.Id;

                var EventoUpdate = _mapper.Map<Evento>(model);

                _geralPersist.Update<Evento>(EventoUpdate);
                if (await _geralPersist.SaveChangesAsync())
                {
                    var retornoEvento = await _eventoPersist.GetEventosByIdAsync(EventoUpdate.Id, false);
                    return _mapper.Map<EventoDto>(retornoEvento);
                }

                return null;

            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteEvento(int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetEventosByIdAsync(eventoId, false);
                if (evento == null) throw new Exception("Evento para delete não foi encontrado");

                _geralPersist.Delete<Evento>(evento);
                return await _geralPersist.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(includePalestrantes);

                if (eventos == null) return null;

                var resultado = _mapper.Map<EventoDto[]>(eventos);

                return resultado;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosByTemaAsync(tema, includePalestrantes);
                if (eventos == null) return null;

                var resultado = _mapper.Map<EventoDto[]>(eventos);

                return resultado;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }
        public async Task<EventoDto> GetEventosByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            try
            {
                var evento = await _eventoPersist.GetEventosByIdAsync(eventoId, includePalestrantes);
                if (evento == null) return null;

                var resultado = _mapper.Map<EventoDto>(evento);

                return resultado;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

       
    }
}