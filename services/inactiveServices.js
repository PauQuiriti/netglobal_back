const { Inactive, Guard, Assignment } = require("../models");
const { Op } = require("sequelize");

class InactiveServices {
  static async addOne(body, guardId) {
    try {
      const inactivity = await Inactive.create(body);
      await inactivity.addGuard(guardId);
      return { error: false, data: inactivity };
    } catch (error) {
      return { error: true, data: error };
    }
  }
  static async deleteOne(inactivityId) {
    try {
      await Inactive.destroy({ where: { id: inactivityId } });
      return { error: false };
    } catch (error) {
      return { error: true, data: error };
    }
  }
  static async updateOne(body, inactivityId) {
    try {
      await Inactive.update(body, { where: { id: inactivityId } });
      const inactivity = await Inactive.findByPk(inactivityId, {
        include: {
          model: Guard,
        },
      });
      const guardId = inactivity.guards[0].id;
      if (inactivity.state === "APPROVED") {
        await Assignment.destroy({
          where: {
            guardId: guardId,
            state: "PENDING",
            startTime: {
              [Op.between]: [
                inactivity.startDate + " 00:00:00",
                inactivity.endDate + " 00:00:00",
              ],
            },
          },
        });
      }
      return { error: false };
    } catch (error) {
      return { error: true, data: error };
    }
  }
  static async getAll(query) {
    if (query.guard) {
      try {
        const guard = await Guard.findByPk(query.guard);
        const inactivities = await guard.getInactivities();
        return { error: false, data: inactivities };
      } catch (error) {
        return { error: true, data: error };
      }
    } else {
      try {
        const inactivities = await Inactive.findAll({
          include: {
            model: Guard,
          },
        });
        return { error: false, data: inactivities };
      } catch (error) {
        return { error: true, data: error };
      }
    }
  }
}

module.exports = InactiveServices;
