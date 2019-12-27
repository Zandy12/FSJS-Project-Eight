const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model { }
    Book.init({
        // Set custom primary key column
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoincrement: true,
        },
        // title, author, genre, year
        title: {
            type: Sequelize.STRING(500),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for "Title"',
                },
                notEmpty: {
                    msg: 'Please provide a value for "Title"',
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for "Author"',
                },
                notEmpty: {
                    msg: 'Please provide a value for "Author"',
                }
            }
        },
        genre: {
            type: Sequelize.STRING,
        },
        year: {
            type: Sequelize.INTEGER,
        }
    }, { sequelize });

    return Book;
}