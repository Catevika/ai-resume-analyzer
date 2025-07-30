import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";

const WipeApp = () => {
  const {auth, isLoading, error, clearError, fs, ai, kv} = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  
  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };
  
  useEffect(() => {
    loadFiles().then();
  }, []);
  
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);
  
  const handleDelete = async () => {
    for (const file of files) {
      await fs.delete(file.path);
    }
    await kv.flush();
    await loadFiles();
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error {error}</div>;
  }
  
  return (
    <main>
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5"/>
          <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
        </Link>
      </nav>
      <section className="main-section">
        <div className="bg-[url('/images/bg-main.svg')] bg-cover rounded-2xl">
          <div className="page-heading py-16 mx-16">
            <h1  className=''>Wipe ALL your Resume analyses</h1>
            <h2>Authenticated as <span className="font-bold">{auth.user?.username}</span>
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col gap-4 mb-10">
              {!isLoading && files.length > 0 && <div>Existing files:</div>}
              {!isLoading && files.length > 0 ? files.map((file) => (
                  <div key={file.id} className="flex flex-row gap-4">
                    <p>{file.name}</p>
                  </div>
              )) : <p className="text-2xl">No file found</p>}
            </div>
            <div>
              <button
                className="bg-blue-500 text-white px-4 py-2 mb-20 rounded-md cursor-pointer"
                onClick={() => handleDelete()}
              >
                Wipe App Data
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WipeApp;
