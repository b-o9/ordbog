const endpoint = "http://localhost:8080/ordbogen/";
let sizes;

(async () => {
    sizes = await getSizes();  // Assign the fetched value to the global variable
    document.getElementById('search').addEventListener('click', async () => {
        const query = document.getElementById('searchInput').value.trim().toLowerCase();
        if (query) {
            const startTime = performance.now();
            const result = await binarySearch(query, sizes.min, sizes.max);
            const endTime = performance.now();
            const elapsedTime = endTime - startTime;

            document.getElementById('time').innerText =`Time: ${Math.floor(elapsedTime) / 1000} sek`;
            document.getElementById('result').innerText =`Headword: ${result.headword} \n ID: ${result.id}\n Inflected: ${result.inflected}`;
            if (result) {
                console.log('Entry found:', result);
            } else {
                console.log('Entry not found.');
            }
        }
    });
})();

async function getSizes() {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function getEntryAt(index) {
    const entry = await fetch(`${endpoint}${index}`).then(resp => resp.json());
    return entry;
}

async function binarySearch(query, low, high) {
    let searchCount = 0;  // Initialize search counter

    while (low <= high) {
        searchCount++;  // Increment counter on each search iteration
        document.getElementById('iterations').innerText = `Iterations: ${searchCount}`;

        const mid = Math.floor((low + high) / 2);
        const entry = await getEntryAt(mid);

        if (!entry) {
            console.log(`Search terminated after ${searchCount} attempts.`);
            return null;  // In case entry is not found, exit the search
        }

        const word = entry.inflected.toLowerCase();

        if (word === query) {
            console.log(`Entry found after ${searchCount} searches.`);
            return entry;  // Query matched exactly
        } else if (word < query) {
            low = mid + 1;  // Search in the upper half
        } else {
            high = mid - 1;  // Search in the lower half
        }
    }

    console.log(`Entry not found after ${searchCount} searches.`);
    return null;  // If not found, return null
}
