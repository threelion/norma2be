function changeRecord(model, id, newData, fieldList) {

	var query = model.findByIdAndUpdate(
		id,
		{ $set: newData },
		{ new: true }
	);

	query.where('is_old').ne(true);

	if (fieldList) {
		query.select(fieldList);
	}

	return query.exec( )
}

module.exports.changeRecord = changeRecord;