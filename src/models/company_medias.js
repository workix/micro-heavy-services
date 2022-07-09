/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('CompanyMedia', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Company',
          key: 'id'
        }
      },
      media: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      url: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    }, {
      tableName: 'companies_medias',
      timestamps: false
    });
  };