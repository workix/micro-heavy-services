const Sequelize = require('sequelize');
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Job = sequelize.define('Job', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('now'),
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },    
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    benefits: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    feature: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    jobCategory: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    jobType: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    maxPayment: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    minPayment: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    requirement: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    company_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Company',
        key: 'id'
      }
    }
  }, {
    tableName: 'jobs',
    hooks: {
      afterCreate(instance, options){
        console.log("HOOK After create")
      },
      beforeUpdate(instance, options){
        instance.updatedAt = Date.now()
      }
    }
  });

  Job.associate = function(models) {
    Job.belongsToMany(models.Candidate,{
      through: 'jobs_candidates',
      foreignKey: 'Job_id',
      otherKey: 'candidates_id',
      timestamps: false,
      as: "candidates"      
    });

    Job.belongsTo(models.Company, {
      foreignKey: 'company_id',
    })
  }

  return Job;
};