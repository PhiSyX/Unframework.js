// -------- //
// Fonction //
// -------- //

function sleep(ms: number)
{
	return new Promise((res) => setTimeout(res, ms));
}

// ------ //
// Export //
// ------ //

export { sleep };
