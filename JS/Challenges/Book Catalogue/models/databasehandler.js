import pg from "pg";

export default class DatabaseHandler {
  constructor(clientInfo) {
    this.database = new pg.Client(clientInfo);
    this.database.connect();
  }

  async fetchAllBooks() {
    return (await this.database.query("SELECT * FROM books")).rows;
  }

  async fetchBooksBy(filter, value) {
    switch (filter) {
      case "category":
        return (
          await this.database.query(
            `SELECT * FROM books
             WHERE category=$1`,
            [value]
          )
        ).rows;
      case "id":
        return (
          await this.database.query(
            `SELECT * FROM books 
             WHERE id = $1`,
            [value]
          )
        ).rows;
    }
  }

  async addBook(bookInfo) {
    this.database.query(
      `INSERT INTO books (
         title,
         author,
         category,
         publish_year,
         abstract,
         cover_id,
         quantity,
         price
         )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      bookInfo
    );
  }

  async fetchBookReviews(id) {
    return (
      await this.database.query(
        `SELECT * FROM book_reviews
       WHERE book_id = $1`,
        [id]
      )
    ).rows;
  }

  async addBookReview(reviewInfo) {
    await this.database.query(
      `INSERT INTO book_reviews (
         review_title,
         reviewer_name,
         review_date,
         review_text,
         user_id,
         review_rating,
         book_id
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      reviewInfo
    );
  }

  async fetchCartItems(user_id) {
    return (
      await this.database.query(
        `SELECT * FROM carts
       WHERE user_id = $1`,
        [user_id]
      )
    ).rows;
  }
}
