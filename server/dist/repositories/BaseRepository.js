"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return await this.model.create(data);
    }
    async findById(id) {
        return await this.model.findByPk(id);
    }
    async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const { count, rows } = await this.model.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
        return {
            items: rows,
            total: count
        };
    }
    async update(id, data) {
        const item = await this.model.findByPk(id);
        if (!item)
            return null;
        return await item.update(data);
    }
    async delete(id) {
        const deleted = await this.model.destroy({
            where: { id }
        });
        return deleted > 0;
    }
}
exports.BaseRepository = BaseRepository;
