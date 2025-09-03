import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Upload, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useResultsStore } from '@/store/resultsStore';
import { useAuthStore } from '@/store/authStore';

export function SubmitResults() {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    courseCode: '',
    courseName: '',
    score: '',
    grade: '',
    semester: '',
    academicYear: '',
    comments: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { submitResult } = useResultsStore();
  const { user } = useAuthStore();

  const gradeOptions = [
    { value: 'A+', label: 'A+ (90-100)' },
    { value: 'A', label: 'A (80-89)' },
    { value: 'B+', label: 'B+ (75-79)' },
    { value: 'B', label: 'B (70-74)' },
    { value: 'C+', label: 'C+ (65-69)' },
    { value: 'C', label: 'C (60-64)' },
    { value: 'D+', label: 'D+ (55-59)' },
    { value: 'D', label: 'D (50-54)' },
    { value: 'E', label: 'E (45-49)' },
    { value: 'F', label: 'F (0-44)' },
  ];

  const semesterOptions = [
    { value: 'Fall 2024', label: 'Fall 2024' },
    { value: 'Spring 2024', label: 'Spring 2024' },
    { value: 'Summer 2024', label: 'Summer 2024' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Auto-calculate grade based on score
    if (field === 'score') {
      const score = parseInt(value);
      let grade = '';
      if (score >= 90) grade = 'A+';
      else if (score >= 80) grade = 'A';
      else if (score >= 75) grade = 'B+';
      else if (score >= 70) grade = 'B';
      else if (score >= 65) grade = 'C+';
      else if (score >= 60) grade = 'C';
      else if (score >= 55) grade = 'D+';
      else if (score >= 50) grade = 'D';
      else if (score >= 45) grade = 'E';
      else grade = 'F';
      
      setFormData(prev => ({ ...prev, grade }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.studentId || !formData.studentName || !formData.courseCode || !formData.courseName || !formData.score) {
        throw new Error('Please fill in all required fields');
      }

      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      submitResult({
        studentId: formData.studentId,
        studentName: formData.studentName,
        courseCode: formData.courseCode,
        courseName: formData.courseName,
        score: parseInt(formData.score),
        grade: formData.grade,
        semester: formData.semester || 'Fall 2024',
        academicYear: formData.academicYear || '2024-2025',
        submittedBy: user!.id,
        comments: formData.comments,
      });

      toast({
        title: "Result Submitted Successfully!",
        description: `${formData.studentName}'s result for ${formData.courseCode} has been submitted for approval.`,
      });

      // Reset form
      setFormData({
        studentId: '',
        studentName: '',
        courseCode: '',
        courseName: '',
        score: '',
        grade: '',
        semester: '',
        academicYear: '',
        comments: '',
      });

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An error occurred while submitting the result.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Submit Results</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Submit student results for approval through the blockchain system
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Student Result Information</CardTitle>
              <CardDescription>
                Enter the student's academic performance details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID *</Label>
                    <Input
                      id="studentId"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange('studentId', e.target.value)}
                      placeholder="CS2021001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name *</Label>
                    <Input
                      id="studentName"
                      value={formData.studentName}
                      onChange={(e) => handleInputChange('studentName', e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseCode">Course Code *</Label>
                    <Input
                      id="courseCode"
                      value={formData.courseCode}
                      onChange={(e) => handleInputChange('courseCode', e.target.value)}
                      placeholder="CS301"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseName">Course Name *</Label>
                    <Input
                      id="courseName"
                      value={formData.courseName}
                      onChange={(e) => handleInputChange('courseName', e.target.value)}
                      placeholder="Data Structures and Algorithms"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="score">Score *</Label>
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.score}
                      onChange={(e) => handleInputChange('score', e.target.value)}
                      placeholder="85"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Auto-calculated" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={formData.semester} onValueChange={(value) => handleInputChange('semester', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesterOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    value={formData.academicYear}
                    onChange={(e) => handleInputChange('academicYear', e.target.value)}
                    placeholder="2024-2025"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Additional Comments</Label>
                  <Textarea
                    id="comments"
                    value={formData.comments}
                    onChange={(e) => handleInputChange('comments', e.target.value)}
                    placeholder="Any additional notes about this result..."
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting to Blockchain...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Result
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submission Guidelines */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Check className="w-5 h-5" />
                <span>Submission Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Verify Information</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Double-check all student details and scores before submission.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Approval Process</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Results will be reviewed by HOD → Dean → DVC → Vice Chancellor.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Blockchain Security</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      All submissions are recorded on the blockchain for transparency.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Track Progress</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Monitor approval status in real-time on your dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Grade Scale</h4>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>A+ (Excellent)</span>
                    <span>90-100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>A (Very Good)</span>
                    <span>80-89</span>
                  </div>
                  <div className="flex justify-between">
                    <span>B+ (Good)</span>
                    <span>75-79</span>
                  </div>
                  <div className="flex justify-between">
                    <span>B (Average)</span>
                    <span>70-74</span>
                  </div>
                  <div className="flex justify-between">
                    <span>C+ (Below Average)</span>
                    <span>65-69</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}