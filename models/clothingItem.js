// Clothing Item model/schema
class ClothingItem {
  constructor(data) {
    this._id = data._id || Date.now().toString();
    this.name = data.name;
    this.weather = data.weather;
    this.imageUrl = data.imageUrl;
    this.owner = data.owner || "5d8b8592978f8bd833ca8133";
    this.likes = data.likes || [];
    this.createdAt = data.createdAt || new Date();
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
    
    if (!this.weather || typeof this.weather !== "string") {
      errors.push("Weather is required and must be a string");
    } else {
      const validWeatherTypes = ["hot", "warm", "cold"];
      if (!validWeatherTypes.includes(this.weather)) {
        errors.push("Weather must be one of: hot, warm, cold");
      }
    }
    
    if (!this.imageUrl || typeof this.imageUrl !== "string") {
      errors.push("Image URL is required and must be a string");
    }
    
    return errors;
  }
}

module.exports = ClothingItem;