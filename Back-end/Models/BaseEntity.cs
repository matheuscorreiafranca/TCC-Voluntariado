using System;
using System.ComponentModel.DataAnnotations;

namespace VoluntaMais.Api.Models
{
    public abstract class BaseEntity
    {
        public long Id { get; set; }
        public DateTime DataInsercao { get; set; }
        public DateTime? DataAtualizacao { get; set; }
        public DateTime? DataDelecao { get; set; }
        public bool Excluido { get; set; } = false;

        [ConcurrencyCheck]
        public Guid VersaoRegistro { get; set; } = Guid.NewGuid();
    }
}
