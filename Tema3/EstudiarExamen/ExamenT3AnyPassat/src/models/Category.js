export class Category {
  constructor(data = {}) {
    this.id = data.id || null
    this.name = data.name || ''
    this.parentId = data.parentId || null
    this.main = data.main || false
    this.parentName = data.parentName || ''
  }

  toPayload() {
    return {
      id: this.id,
      name: this.name,
      parentId: this.parentId,
      main: this.main
    }
  }
}
