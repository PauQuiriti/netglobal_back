const BranchServices = require('../services/branchServices')

class BranchController {
    static async getAll(req, res) {
        const { error, data } = await BranchServices.getAll();
        if (error) {
          return res.status(500).send(data);
        }
        res.status(200).send(data);
      }
      static async getOne(req, res) {
        const { error, data } = await BranchServices.getOne(req.params.id);
        if (error) {
          return res.status(500).send(data);
        }
        return res.status(200).send(data);
      }
      static async updateOne(req,res){
        const {error,data} = await BranchServices.updateOne(req.body,
            req.params.id)
        if (error) {
                return res.status(500).send(data);
              }
       return res.status(204).send(data);    
      }
      static async  getGuards(req,res){
        const {error,data} = await BranchServices.getGuards(req.params.id)
        if (error) {
          return res.status(500).send(data);
        }
       return res.status(200).send(data);  
      }
      
}

module.exports = BranchController