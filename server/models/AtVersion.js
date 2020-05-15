module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        'AtVersion',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            at_name_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'at_name',
                    key: 'id'
                },
                unique: true
            },
            version: {
                type: DataTypes.STRING,
                allowNull: true,
                primaryKey: true
            },
            release_order: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        },
        {
            timestamps: false,
            tableName: 'at_version'
        }
    );
};
