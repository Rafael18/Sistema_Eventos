
using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage ="O campo {0} é obrigatório")]
        public string? Local { get; set; }
        [Required(ErrorMessage ="O campo {0} é obrigatório")]
        public DateTime? DataEvento { get; set; }
        [Required(ErrorMessage ="O campo {0} é obrigatório")]
        [StringLength(50, MinimumLength = 3, ErrorMessage="Intervalo permitido de 3 a 50 caracteres")]
        public string? Tema { get; set; }      
        [Required(ErrorMessage ="O campo {0} é obrigatório")]
        [Display(Name ="Qtd Pessoas")]
        [Range(1, 120000, ErrorMessage ="{0} não pode ser menor que 1 e maior que 120.000")]
        public int? QtdPessoas { get; set; }
        [Required]
        [RegularExpression(@".*\.(gif|jp?g|bmp|png)$", ErrorMessage ="Não é uma imagem válida. (.gif, .jpg, jpeg, bmp ou png)")]
        public string? ImagemUrl { get; set; }
        [Required(ErrorMessage ="O campo {0} é obrigatório")]
        [Phone(ErrorMessage ="O campo {0} está com número inválido")]
        public string Telefone { get; set; }
        [Required(ErrorMessage ="O campo {0} é obrigatório")]
        [Display(Name ="E-mail")]
        [EmailAddress(ErrorMessage ="Informe um {0} válido")]
        public string Email { get; set; }
        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteDto> PalestrantesEventos { get; set; }

    }
}