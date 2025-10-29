// User model/schema
class User {
  constructor(data) {
    this._id = data._id || Date.now().toString();
    this.name = data.name;
    this.avatar = data.avatar;
  }

  // Validation method
  validate() {
    const errors = [];
    
    if (!this.name || typeof this.name !== "string") {
      errors.push("Name is required and must be a string");
    } else if (this.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    } else if (this.name.trim().length > 30) {
      errors.push("Name must be no more than 30 characters");
    }
    
    if (!this.avatar || typeof this.avatar !== "string") {
      errors.push("Avatar is required and must be a string");
    }
    
    return errors;
  }
}

module.exports = User;