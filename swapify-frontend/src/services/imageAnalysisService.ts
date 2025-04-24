import { pipeline } from '@xenova/transformers';

export class ImageAnalysisService {
  private static classifier: any = null;
  private static detector: any = null;

  static async getClassifier() {
    if (!this.classifier) {
      this.classifier = await pipeline(
        'image-classification', 
        'Xenova/vit-base-patch16-224'
      );
    }
    return this.classifier;
  }

  static async getDetector() {
    if (!this.detector) {
      this.detector = await pipeline(
        'object-detection',
        'Xenova/detr-resnet-50'
      );
    }
    return this.detector;
  }

  static async analyzeImage(image: HTMLImageElement | string) {
    try {
      const classifier = await this.getClassifier();
      const detector = await this.getDetector();
      
      const [classification, detection] = await Promise.all([
        classifier(image, { topk: 5 }),
        detector(image)
      ]);
      
      return {
        labels: classification.map((item: any) => item.label),
        objects: detection.map((item: any) => item.label),
        fullAnalysis: {
          classification,
          detection
        }
      };
    } catch (error) {
      console.error("Error analyzing image:", error);
      return {
        labels: [],
        objects: [],
        fullAnalysis: null
      };
    }
  }

  static async verifyMatch(
    image: HTMLImageElement | string,
    title: string,
    description: string
  ) {
    const { labels, objects } = await this.analyzeImage(image);
    const text = `${title} ${description}`.toLowerCase();
    const allTags = [...new Set([...labels, ...objects])];
    
    const matchingTags = allTags.filter(tag => 
      text.includes(tag.toLowerCase())
    );

    return {
      matchPercentage: (matchingTags.length / Math.max(1, allTags.length)) * 100,
      allTags,
      matchingTags,
      suggestions: allTags.filter(tag => !text.includes(tag.toLowerCase()))
    };
  }
}