module.exports = async () => {
	console.log(`============ testSetupFile Loaded ===========`);
	jest.useFakeTimers();
	jest.setTimeout(10000);
};
