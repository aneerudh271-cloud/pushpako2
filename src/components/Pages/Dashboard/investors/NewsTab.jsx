export default function NewsTab() {
  const news = [
    {
      title: 'New Partnership Announced',
      content: 'Pushpako2 partners with major airline for urban air mobility integration.',
      date: '2024-01-15',
      borderColor: 'border-blue-500',
    },
    {
      title: 'Successful Test Flight',
      content: 'Hydrogen-powered aircraft completes 500km test flight.',
      date: '2024-01-10',
      borderColor: 'border-green-500',
    },
    {
      title: 'Series A Funding Round',
      content: 'Successfully raised $10M in Series A funding to accelerate hydrogen technology development.',
      date: '2024-01-05',
      borderColor: 'border-yellow-500',
    },
  ];

  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-4">News & Updates</h2>
      <div className="space-y-4 md:space-y-6">
        {news.map((item, index) => (
          <div key={index} className={`border-l-4 ${item.borderColor} pl-4 md:pl-6 bg-gray-700 p-4 rounded-r-lg`}>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-300 mb-2">{item.content}</p>
            <p className="text-sm text-gray-400">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}