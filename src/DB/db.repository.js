export class DBRepository {
  nModel;
  constructor(model) {
    this.nModel = model;
  }
  async create(item) {
    const doc = new this.nModel(item);
    return await doc.save();
  }

  async update(filter, update, options = {}) {
    return await User.findOneAndUpdate(filter, update, options);
  }

  async getOne(filter, projection = {}, options = {}) {
    return await this.nModel.findOne(filter, projection, options);
  }

  async getAll(filter, projection = {}, options = {}) {
    return await this.nModel.find(filter, projection, options);
  }

  async deleteOne(filter) {
    return await this.nModel.deleteOne(filter);
  }
}


