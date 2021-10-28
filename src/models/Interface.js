'use strict';

// creat Interface class to contact with DB
class Interface {
  constructor(model) {
    this.model = model;
  }

  // get method
  get(_id) {
    if (_id) {
      return this.model.findOne({ _id });
    } else {
      return this.model.find({});
    }
  }

  // post method
  create(document) {
    let newDocument = new this.model(document);
    return newDocument.save();
  }

  // put method
  update(_id, document) {
    return this.model.findByIdAndUpdate(_id, document, { new: true });
  }

  // delete method
  delete(_id) {
    return this.model.findByIdAndDelete(_id);
  }
}

module.exports = Interface;
