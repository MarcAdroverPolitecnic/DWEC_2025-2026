export class Obra {
  constructor(data = {}) {
    this.titol = data.titol || ''
    this.url = data.url || ''
    this.data = data.data || ''
    this.categoria = data.categoria || ''
    this.iditem = data.iditem || null
  }

  toPayload() {
    return {
      titol: this.titol,
      url: this.url,
      data: this.data,
      categoria: this.categoria
    }
  }
}
